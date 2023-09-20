==================================
Water Data Explorer (WDE) La Plata
==================================

Introduction
************

In recent years, there has been a growing recognition of the need for standardized ways of sharing water data on the web.
In response to this need, the Consortium of Universities for the Advancement of Hydrologic Science (CUAHSI)
Hydrologic Information System (HIS) has been developed along with the standardized WaterOneFlow web services and WaterML
data exchange format. To access data that are shared using the WaterOneFlow services and WaterML format,
tools already exist such as the
`Microsoft Windows HydroDesktop software <https://www.sciencedirect.com/science/article/pii/S1364815212001053>`_ ,
`WaterML R package <https://github.com/jirikadlec2/waterml>`_, and the web-based `CUAHSI HydroClient <https://data.cuahsi.org/>`_ which serves as an access point to the `CUAHSI HIS <http://hiscentral.cuahsi.org/>`_ database.


Water Data Explorer (WDE) is a newly developed web-based tool allowing a broad range of users to discover, access, visualize, and download data from any Information System that makes available water data in WaterML format through WaterOneFlow services. WDE is designed in a way that allows users to customize it for local or regional web portals.


WDE Overview
************

WDE is an open-source web application providing users with the functionalities of data discovery, data access, data visualization, and data downloading from any Information System that makes available water data in WaterML format through WaterOneFlow web services. WDE  can be installed by any organization and requires minimal server space.

User Interface
--------------

To organize and manage various WaterOneFlow web services, WDE uses Data Views that are organized in Catalogs.


.. image:: images/1.1.png
   :width: 1000
   :align: center


Each Data View contains a set of data that is accessible through a specific WaterOneFlow web service.

The stations for which data are accessible through a specific Data View are displayed on the WDE map interface along with a legend of the respective Data Views. Views also contain WMS Layers, which can be displayed with the different stations


.. image:: images/1.2.png
   :width: 1000
   :align: center


For each Station/Platform, a set of metadata is available in the Graphs Panel of the WDE User Interface. Also, for each Station/Platform, a table of observed variables is available and includes variable names, units, and interpolation types.


.. image:: images/1.3.png
   :width: 1000
   :align: center


Station/Platform time series data can be plotted as “Scatter” or “Whisker and Box” plots, and be downloaded in CSV, `OGC NetCDF <https://www.ogc.org/standards/netcdf>`_ , `OGC WaterML 2.0 <https://www.ogc.org/standards/waterml>`_ , and `CUAHSI WaterML 1.0 <https://his.cuahsi.org/wofws.html>`_ formats for any available time period of interest in the Time Series Plots section.


.. image:: images/1.4.png
   :width: 1000
   :align: center


Installation
------------

WDE can be installed in production services through a Docker image or directly on a server .

Docker
~~~~~~
Docker Image: `byuhydro/wde <https://hub.docker.com/r/byuhydro/wde>`_

The WDE docker image installation has support for different types of architectures:

Two Images: one PostgreSQL image and WDE image.

  - Using a `docker-compose.yml <https://github.com/BYU-Hydroinformatics/water-data-explorer-whos/blob/inmet-WDE/docker_files/docker-compose.yml>`_ to run both containers declaring environment variables::

       docker-compose up

  - Running two different containers with a file containing the environment variables::

       docker run --name postgres -e POSTGRES_PASSWORD=passpass -p 5432:5432 -d postgres

       docker run -it --env-file env.txt -p 80:80 byuhydro/wde

One Image: one WDE image connected to a local instance of PostgreSQL or an Amazon RSD postgreSQL database.

  - Using local instance of PostgreSQL with a file containing the environment variables::

      docker run -it --env-file env.txt -p 80:80 byuhydro/wde

  - Using an Amazon RSD postgreSQL database with a file containing the environment variables::

      docker run -it --env-file env.txt -p 80:80 byuhydro/wde

.. note::
   Currently there is only support for AWS if an cloud based database is used.

.. note::
   env.txt sample files can be found in `here <https://github.com/BYU-Hydroinformatics/water-data-explorer-whos/tree/master/docker_files/helpful_files>`_

Regular Production Installation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When installing WDE using the regular installation process in a production env, you will need to install the Tethys Platform first and
then install WDE app. Follow this `guide <http://docs.tethysplatform.org/en/stable/installation/production.html>`_ for an
step by step process.

Regular Development Installation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

WDE can also be installed in your local computer without the need to do a production installation in any server. You will need
to install the Tethys Platform first and then WDE app.

  - Use this `guide <http://docs.tethysplatform.org/en/stable/installation.html>`_ to install the Tethys Platform.
  - Use this `guide <http://docs.tethysplatform.org/en/stable/installation/application.html>`_ to install WDE in the Tethys Platform.


Developers
----------

WDE has been developed by Elkin Giovanni Romero Bustamante
at `Brigham Young University's (BYU) Hydroinformatics laboratory <https://hydroinformatics.byu.edu/>`_
with the support of the World Meteorological Organization.
The BYU's Hydroinformatics laboratory focuses on delivering different software products and services for water modelling. Some of the most important works include:
`Global Streamflow Forecast Services API <https://hydroinformatics.byu.edu/global-streamflow-forecasts>`_ ,
creation of the `Tethys Platform <https://hydroinformatics.byu.edu/tethys-platform>`_ ,
and `Hydroserver Lite <http://128.187.106.131/Historical_Data_template.php>`_ . The most recent publications and works can be found on the BYU Hydroinformatics website.

Source Code
-----------

The WDE source code is available on Github:

  - https://github.com/BYU-Hydroinformatics/water-data-explorer-whos

.. note::
   Please feel free to contribute.
